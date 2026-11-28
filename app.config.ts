import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Extends app.json with values that come from the environment (.env).
 *
 * Google Sign-In on iOS needs the reversed iOS client ID registered as a URL scheme:
 * "123-abc.apps.googleusercontent.com" -> "com.googleusercontent.apps.123-abc".
 * Without EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID the plugin is skipped and the build still works,
 * but Google Sign-In fails on iOS.
 */
const GOOGLE_SUFFIX = '.apps.googleusercontent.com';

function googleIosUrlScheme(iosClientId: string | undefined) {
  if (!iosClientId?.endsWith(GOOGLE_SUFFIX)) return null;
  return `com.googleusercontent.apps.${iosClientId.slice(0, -GOOGLE_SUFFIX.length)}`;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const iosUrlScheme = googleIosUrlScheme(process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID);

  return {
    ...config,
    name: config.name ?? 'gastia',
    slug: config.slug ?? 'gastia',
    plugins: [
      ...(config.plugins ?? []),
      ...(iosUrlScheme
        ? [['@react-native-google-signin/google-signin', { iosUrlScheme }] as [string, unknown]]
        : []),
    ],
  };
};
