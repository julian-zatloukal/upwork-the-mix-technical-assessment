import { defaultDarkModeOverride } from '@aws-amplify/ui-react-native';
import { AuthColors, PRIMARY_SCALE } from '../../constants/theme';

/**
 * Auth routes where `isPending === true` means a sign-in / sign-up action
 * is in flight.  When the user signs *out*, the route is `'authenticated'`,
 * so that case is intentionally excluded.
 */
export const SIGN_IN_ROUTES = new Set([
  'signIn',
  'signUp',
  'confirmSignIn',
  'confirmSignUp',
  'forceNewPassword',
  'resetPassword',
  'confirmResetPassword',
  'setupTotp',
  'verifyUser',
  'confirmVerifyUser',
]);

/**
 * Amplify UI dark-mode theme override.
 *
 * Replaces the full `primary` color scale so every button, link, and focus
 * ring uses the app's brand color, and maps background / font / border tokens
 * to the design-token values in `constants/theme.ts`.
 */
export const amplifyDarkTheme = {
  overrides: [
    defaultDarkModeOverride,
    {
      colorMode: 'dark' as const,
      tokens: {
        colors: {
          primary: {
            10:  { value: PRIMARY_SCALE[10] },
            20:  { value: PRIMARY_SCALE[20] },
            40:  { value: PRIMARY_SCALE[40] },
            60:  { value: PRIMARY_SCALE[60] },
            80:  { value: PRIMARY_SCALE[80] },
            90:  { value: PRIMARY_SCALE[90] },
            100: { value: PRIMARY_SCALE[100] },
          },
          background: {
            primary:   { value: AuthColors.bgPrimary },
            secondary: { value: AuthColors.bgSecondary },
            tertiary:  { value: AuthColors.bgTertiary },
          },
          font: {
            primary:   { value: AuthColors.fontPrimary },
            secondary: { value: AuthColors.fontSecondary },
            tertiary:  { value: AuthColors.fontTertiary },
          },
          border: {
            primary:   { value: AuthColors.borderPrimary },
            secondary: { value: AuthColors.borderSecondary },
          },
        },
      },
    },
  ],
};
