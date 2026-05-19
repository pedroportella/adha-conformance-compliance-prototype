<?php

namespace Drupal\adha_conformance\Service;

use Drupal\Core\Database\Connection;

final class ConformanceRepository {

  private const TABLE = 'adha_conformance_submission';

  public function __construct(
    private readonly Connection $database,
  ) {}

  /**
   * @return array<int, array<string, mixed>>
   */
  public function findAll(): array {
    return array_map(static fn (array $record): array => self::toSummary($record), $this->readRecords());
  }

  /**
   * @return array<int, array<string, mixed>>
   */
  public function findAllForAdmin(): array {
    return $this->readRecords();
  }

  /**
   * @return array<string, mixed>|null
   */
  public function findById(string $id): ?array {
    foreach ($this->readRecords() as $record) {
      if (($record['id'] ?? NULL) === $id) {
        return $record;
      }
    }

    return NULL;
  }

  /**
   * @param array<string, mixed> $payload
   *
   * @return array<string, mixed>
   */
  public function create(array $payload): array {
    $id = 'adha-conf-' . date('YmdHis') . '-' . bin2hex(random_bytes(3));
    $referenceNumber = 'ADHA-CONF-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(3)));
    $submittedAt = date(DATE_ATOM);

    $record = [
      'id' => $id,
      'referenceNumber' => $referenceNumber,
      'organisationName' => $this->getString($payload, 'organisationName'),
      'contactName' => $this->getString($payload, 'contactName'),
      'contactEmail' => $this->getString($payload, 'contactEmail'),
      'productName' => $this->getString($payload, 'productName'),
      'productVersion' => $this->getString($payload, 'productVersion'),
      'conformanceProfile' => $this->getString($payload, 'conformanceProfile'),
      'integrationType' => $this->getString($payload, 'integrationType'),
      'workflowStatus' => 'Submitted',
      'riskLevel' => $this->getString($payload, 'riskLevel', 'Medium'),
      'targetReleaseDate' => $this->getString($payload, 'targetReleaseDate'),
      'standards' => $this->getStringList($payload, 'standards'),
      'controlChecks' => $this->getList($payload, 'controlChecks'),
      'evidenceDocuments' => $this->getList($payload, 'evidenceDocuments'),
      'submittedAt' => $submittedAt,
    ];

    $this->database->insert(self::TABLE)
      ->fields([
        'id' => $id,
        'reference_number' => $referenceNumber,
        'organisation_name' => $record['organisationName'],
        'product_name' => $record['productName'],
        'workflow_status' => $record['workflowStatus'],
        'risk_level' => $record['riskLevel'],
        'submitted_at' => $submittedAt,
        'payload' => json_encode($record, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
      ])
      ->execute();

    return $record;
  }

  /**
   * @return array<int, array<string, mixed>>
   */
  private function readRecords(): array {
    $query = $this->database->select(self::TABLE, 'submission')
      ->fields('submission', [
        'id',
        'reference_number',
        'organisation_name',
        'product_name',
        'workflow_status',
        'risk_level',
        'submitted_at',
        'payload',
      ])
      ->orderBy('submitted_at', 'DESC');

    $records = [];

    foreach ($query->execute() as $row) {
      $records[] = $this->rowToRecord((array) $row);
    }

    return $records;
  }

  /**
   * @param array<string, mixed> $record
   *
   * @return array<string, mixed>
   */
  private static function toSummary(array $record): array {
    return [
      'id' => $record['id'] ?? '',
      'referenceNumber' => $record['referenceNumber'] ?? '',
      'organisationName' => $record['organisationName'] ?? 'Unknown organisation',
      'productName' => $record['productName'] ?? 'Unknown product',
      'workflowStatus' => $record['workflowStatus'] ?? 'Submitted',
      'riskLevel' => $record['riskLevel'] ?? 'Medium',
      'submittedAt' => $record['submittedAt'] ?? NULL,
    ];
  }

  /**
   * @param array<string, mixed> $row
   *
   * @return array<string, mixed>
   */
  private function rowToRecord(array $row): array {
    $payload = json_decode((string) ($row['payload'] ?? '{}'), TRUE);
    $record = is_array($payload) ? $payload : [];

    $record['id'] = (string) ($row['id'] ?? $record['id'] ?? '');
    $record['referenceNumber'] = (string) ($row['reference_number'] ?? $record['referenceNumber'] ?? '');
    $record['organisationName'] = (string) ($row['organisation_name'] ?? $record['organisationName'] ?? '');
    $record['productName'] = (string) ($row['product_name'] ?? $record['productName'] ?? '');
    $record['workflowStatus'] = (string) ($row['workflow_status'] ?? $record['workflowStatus'] ?? 'Submitted');
    $record['riskLevel'] = (string) ($row['risk_level'] ?? $record['riskLevel'] ?? 'Medium');
    $record['submittedAt'] = (string) ($row['submitted_at'] ?? $record['submittedAt'] ?? '');

    return $record;
  }

  /**
   * @param array<string, mixed> $payload
   */
  private function getString(array $payload, string $key, string $fallback = ''): string {
    return is_string($payload[$key] ?? NULL) ? trim($payload[$key]) : $fallback;
  }

  /**
   * @param array<string, mixed> $payload
   *
   * @return array<int, array<string, mixed>>
   */
  private function getList(array $payload, string $key): array {
    $value = $payload[$key] ?? [];

    if (!is_array($value)) {
      return [];
    }

    return array_values(array_filter($value, 'is_array'));
  }

  /**
   * @param array<string, mixed> $payload
   *
   * @return array<int, string>
   */
  private function getStringList(array $payload, string $key): array {
    $value = $payload[$key] ?? [];

    if (!is_array($value)) {
      return [];
    }

    return array_values(array_filter($value, 'is_string'));
  }

}
