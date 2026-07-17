"use client";

import {
  createContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";

const STORAGE_KEY = "ethra_banner_dismissals_v1";

interface BannerVisibilityState {
  dismissedModalBannerId: string | null;
  /** IDs de mensajes persistentes descartados en esta sesión (puede haber varios activos a la vez). */
  dismissedPersistentBannerIds: string[];
}

type BannerVisibilityAction =
  | { type: "HYDRATE"; payload: BannerVisibilityState }
  | { type: "DISMISS_MODAL"; bannerId: string }
  | { type: "DISMISS_PERSISTENT"; bannerIds: string[] };

export interface BannerVisibilityContextValue {
  state: BannerVisibilityState;
  isHydrated: boolean;
  dispatch: Dispatch<BannerVisibilityAction>;
  dismissModal: (bannerId: string) => void;
  /** Descarta TODOS los mensajes persistentes actualmente visibles (cierra la franja completa). */
  dismissPersistent: (bannerIds: string[]) => void;
}

function isBannerVisibilityState(x: unknown): x is BannerVisibilityState {
  if (!x || typeof x !== "object") return false;
  const s = x as Record<string, unknown>;
  return (
    (s.dismissedModalBannerId === null || typeof s.dismissedModalBannerId === "string") &&
    Array.isArray(s.dismissedPersistentBannerIds) &&
    s.dismissedPersistentBannerIds.every((id) => typeof id === "string")
  );
}

function bannerVisibilityReducer(
  state: BannerVisibilityState,
  action: BannerVisibilityAction,
): BannerVisibilityState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "DISMISS_MODAL":
      return { ...state, dismissedModalBannerId: action.bannerId };
    case "DISMISS_PERSISTENT":
      return {
        ...state,
        dismissedPersistentBannerIds: Array.from(
          new Set([...state.dismissedPersistentBannerIds, ...action.bannerIds]),
        ),
      };
    default:
      return state;
  }
}

export const BannerVisibilityContext = createContext<BannerVisibilityContextValue | undefined>(
  undefined,
);

export function BannerVisibilityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bannerVisibilityReducer, {
    dismissedModalBannerId: null,
    dismissedPersistentBannerIds: [],
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isBannerVisibilityState(parsed)) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch {
      // JSON inválido — estado vacío
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // quota exceeded, etc.
    }
  }, [state, isHydrated]);

  const dismissModal = (bannerId: string) => {
    dispatch({ type: "DISMISS_MODAL", bannerId });
  };

  const dismissPersistent = (bannerIds: string[]) => {
    dispatch({ type: "DISMISS_PERSISTENT", bannerIds });
  };

  return (
    <BannerVisibilityContext.Provider
      value={{ state, isHydrated, dispatch, dismissModal, dismissPersistent }}
    >
      {children}
    </BannerVisibilityContext.Provider>
  );
}
