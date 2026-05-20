<?php

namespace Drupal\adha_conformance\Theme;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Theme\ThemeNegotiatorInterface;

final class AdminThemeNegotiator implements ThemeNegotiatorInterface {

  public function __construct(
    private readonly ConfigFactoryInterface $configFactory,
  ) {}

  public function applies(RouteMatchInterface $route_match): bool {
    return in_array($route_match->getRouteName(), [
      'adha_conformance.admin_register',
      'entity.user.canonical',
      'entity.user.edit_form',
      'user.edit',
      'user.login',
      'user.page',
      'user.pass',
      'user.register',
    ], TRUE);
  }

  public function determineActiveTheme(RouteMatchInterface $route_match): ?string {
    $admin_theme = $this->configFactory->get('system.theme')->get('admin');

    return is_string($admin_theme) && $admin_theme !== '' ? $admin_theme : 'claro';
  }

}
