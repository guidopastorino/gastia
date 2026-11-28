import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Alert } from 'react-native';
import Purchases, {
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesError,
  type PurchasesPackage,
} from 'react-native-purchases';

import { useAuth } from '../../auth/AuthProvider';

/** RevenueCat entitlement that unlocks Pro features. */
export const PRO_ENTITLEMENT = 'pro';

const API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;

type Status =
  /** Reading the customer from RevenueCat. */
  | 'loading'
  | 'ready'
  /** No API key, or RevenueCat could not be reached: the user is treated as Free. */
  | 'unavailable';

type SubscriptionContextValue = {
  status: Status;
  isPro: boolean;
  /** Monthly Pro package from the current offering, with its localized price. */
  proPackage: PurchasesPackage | null;
  /** ISO date when Pro ends or renews; null for Free or lifetime. */
  expiresAt: string | null;
  willRenew: boolean;
  purchasing: boolean;
  purchasePro: () => Promise<void>;
  restore: () => Promise<void>;
  manage: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

// configure() must run once per app launch; later users switch with logIn().
let configured = false;

function isCancelled(e: unknown) {
  return (e as PurchasesError | undefined)?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;
}

function errorMessage(e: unknown) {
  return e instanceof Error ? e.message : 'Inténtalo de nuevo en unos minutos.';
}

/**
 * Pro status of the signed-in user. The RevenueCat customer is the Supabase user id,
 * so a subscription follows the account across devices.
 */
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const [status, setStatus] = useState<Status>(API_KEY ? 'loading' : 'unavailable');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [proPackage, setProPackage] = useState<PurchasesPackage | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (!API_KEY || !userId) return;
    let cancelled = false;

    (async () => {
      try {
        if (!configured) {
          Purchases.configure({ apiKey: API_KEY, appUserID: userId });
          configured = true;
        } else {
          await Purchases.logIn(userId);
        }
        const [info, offerings] = await Promise.all([Purchases.getCustomerInfo(), Purchases.getOfferings()]);
        if (cancelled) return;
        setCustomerInfo(info);
        setProPackage(offerings.current?.monthly ?? offerings.current?.availablePackages[0] ?? null);
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('unavailable');
      }
    })();

    // Purchases, renewals and expirations update the app without a reload.
    const onUpdate = (info: CustomerInfo) => setCustomerInfo(info);
    Purchases.addCustomerInfoUpdateListener(onUpdate);
    return () => {
      cancelled = true;
      Purchases.removeCustomerInfoUpdateListener(onUpdate);
    };
  }, [userId]);

  const entitlement = customerInfo?.entitlements.active[PRO_ENTITLEMENT];

  const purchasePro = useCallback(async () => {
    if (!proPackage) {
      Alert.alert('Gastia Pro', 'La suscripción no está disponible en este momento.');
      return;
    }
    setPurchasing(true);
    try {
      const { customerInfo: info } = await Purchases.purchasePackage(proPackage);
      setCustomerInfo(info);
    } catch (e) {
      if (!isCancelled(e)) Alert.alert('No se pudo completar la compra', errorMessage(e));
    } finally {
      setPurchasing(false);
    }
  }, [proPackage]);

  const restore = useCallback(async () => {
    if (status !== 'ready') {
      Alert.alert('Restaurar compras', 'La suscripción no está disponible en este momento.');
      return;
    }
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      const restored = !!info.entitlements.active[PRO_ENTITLEMENT];
      Alert.alert(
        'Restaurar compras',
        restored ? 'Listo, tu plan Pro está activo.' : 'No encontramos una suscripción Pro en esta cuenta.',
      );
    } catch (e) {
      Alert.alert('No se pudieron restaurar las compras', errorMessage(e));
    }
  }, [status]);

  const manage = useCallback(async () => {
    try {
      await Purchases.showManageSubscriptions();
    } catch (e) {
      Alert.alert('Gestionar suscripción', errorMessage(e));
    }
  }, []);

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      status: userId ? status : 'loading',
      isPro: !!entitlement,
      proPackage,
      expiresAt: entitlement?.expirationDate ?? null,
      willRenew: entitlement?.willRenew ?? false,
      purchasing,
      purchasePro,
      restore,
      manage,
    }),
    [userId, status, entitlement, proPackage, purchasing, purchasePro, restore, manage],
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider');
  return ctx;
}
