<?php

namespace Drupal\adha_conformance\Controller;

use Drupal\adha_conformance\Service\ConformanceRepository;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Render\Markup;
use Drupal\file\FileRepositoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

final class ConformanceController implements ContainerInjectionInterface {

  public function __construct(
    private readonly ConformanceRepository $repository,
    private readonly FileRepositoryInterface $fileRepository,
    private readonly FileSystemInterface $fileSystem,
  ) {}

  public static function create(ContainerInterface $container): self {
    return new self(
      $container->get('adha_conformance.repository'),
      $container->get('file.repository'),
      $container->get('file_system'),
    );
  }

  public function list(): JsonResponse {
    return new JsonResponse($this->repository->findAll());
  }

  public function view(string $id): JsonResponse {
    $submission = $this->repository->findById($id);

    if ($submission === NULL) {
      return new JsonResponse(['message' => 'Conformance submission not found.'], 404);
    }

    return new JsonResponse($submission);
  }

  public function store(Request $request): JsonResponse {
    $payload = json_decode($request->getContent(), TRUE);

    if (!is_array($payload)) {
      return new JsonResponse(['message' => 'Invalid JSON payload.'], 400);
    }

    $errors = $this->validatePayload($payload);

    if ($errors !== []) {
      return new JsonResponse([
        'message' => 'Validation failed.',
        'errors' => $errors,
      ], 422);
    }

    return new JsonResponse($this->repository->create($payload), 201);
  }

  public function uploadEvidence(Request $request): JsonResponse {
    $uploadedFile = $request->files->get('file');

    if ($uploadedFile === NULL) {
      return new JsonResponse(['message' => 'Choose an evidence document to upload.'], 422);
    }

    if (!$uploadedFile->isValid()) {
      return new JsonResponse(['message' => 'The evidence upload did not complete successfully.'], 422);
    }

    if ($uploadedFile->getSize() !== NULL && $uploadedFile->getSize() > 10 * 1024 * 1024) {
      return new JsonResponse(['message' => 'The evidence document must be 10 MB or smaller.'], 422);
    }

    $allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'xlsx', 'csv'];
    $extension = strtolower((string) $uploadedFile->getClientOriginalExtension());

    if (!in_array($extension, $allowedExtensions, TRUE)) {
      return new JsonResponse(['message' => 'The evidence document type is not supported.'], 422);
    }

    $directory = 'public://adha-conformance-evidence';
    if (!$this->fileSystem->prepareDirectory($directory, FileSystemInterface::CREATE_DIRECTORY | FileSystemInterface::MODIFY_PERMISSIONS)) {
      return new JsonResponse(['message' => 'Unable to prepare evidence storage.'], 500);
    }

    $contents = file_get_contents($uploadedFile->getRealPath());

    if ($contents === FALSE) {
      return new JsonResponse(['message' => 'Unable to read the uploaded evidence document.'], 500);
    }

    $safeFilename = preg_replace('/[^A-Za-z0-9._-]/', '-', $uploadedFile->getClientOriginalName()) ?: 'evidence.' . $extension;
    $file = $this->fileRepository->writeData($contents, $directory . '/' . $safeFilename, FileSystemInterface::EXISTS_RENAME);
    $file->setPermanent();
    $file->save();

    return new JsonResponse([
      'fileId' => (string) $file->id(),
      'fileName' => $file->getFilename(),
      'fileSize' => (int) $file->getSize(),
      'fileType' => $file->getMimeType() ?: $uploadedFile->getMimeType() ?: 'application/octet-stream',
      'url' => $file->createFileUrl(FALSE),
      'uploadedAt' => date(DATE_ATOM),
    ], 201);
  }

  public function adminList(): array {
    $submissions = $this->repository->findAllForAdmin();
    $rows = '';

    foreach ($submissions as $submission) {
      $rows .= '<tr>';
      $rows .= '<td>' . $this->escape((string) ($submission['referenceNumber'] ?? '')) . '</td>';
      $rows .= '<td>' . $this->escape((string) ($submission['organisationName'] ?? 'Unknown organisation')) . '</td>';
      $rows .= '<td>' . $this->escape((string) ($submission['productName'] ?? 'Unknown product')) . '</td>';
      $rows .= '<td><span class="adha-admin-status">' . $this->escape((string) ($submission['workflowStatus'] ?? 'Submitted')) . '</span></td>';
      $rows .= '<td>' . $this->escape((string) ($submission['riskLevel'] ?? 'Medium')) . '</td>';
      $rows .= '<td>' . $this->escape($this->formatDate((string) ($submission['submittedAt'] ?? ''))) . '</td>';
      $rows .= '</tr>';
    }

    if ($rows === '') {
      $rows = '<tr><td colspan="6">No conformance submissions have been received yet.</td></tr>';
    }

    $html = '<div class="adha-admin-hero">';
    $html .= '<p>Administration</p>';
    $html .= '<h1>ADHA conformance register</h1>';
    $html .= '<span>Review vendor/provider submissions, risk, evidence status and assessment workflow.</span>';
    $html .= '</div>';
    $html .= '<div class="adha-admin-panel">';
    $html .= '<h2>Submissions</h2>';
    $html .= '<table><thead><tr><th>Reference</th><th>Organisation</th><th>Product</th><th>Status</th><th>Risk</th><th>Submitted</th></tr></thead><tbody>' . $rows . '</tbody></table>';
    $html .= '</div>';

    return [
      '#markup' => Markup::create($html),
      '#attached' => [
        'library' => ['adha_conformance/admin'],
      ],
    ];
  }

  /**
   * @param array<string, mixed> $payload
   *
   * @return array<string, string>
   */
  private function validatePayload(array $payload): array {
    $errors = [];

    foreach (['organisationName', 'contactEmail', 'productName', 'conformanceProfile'] as $field) {
      if (!is_string($payload[$field] ?? NULL) || trim($payload[$field]) === '') {
        $errors[$field] = 'This field is required.';
      }
    }

    if (isset($payload['contactEmail']) && is_string($payload['contactEmail']) && !filter_var($payload['contactEmail'], FILTER_VALIDATE_EMAIL)) {
      $errors['contactEmail'] = 'Enter a valid contact email address.';
    }

    return $errors;
  }

  private function formatDate(string $value): string {
    if ($value === '') {
      return 'Not submitted';
    }

    $timestamp = strtotime($value);

    return $timestamp === FALSE ? $value : date('d M Y', $timestamp);
  }

  private function escape(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  }

}
