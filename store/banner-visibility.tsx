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
  dismissedPersistentBannerId: string | null;
}

type BannerVisibilityAction =
  | { type: "HYDRATE"; payload: BannerVisibilityState }
  | { type: "DISMISS_MODAL"; bannerId: string }
  | { type: "DISMISS_PERSISTENT"; bannerId: string };

export interface BannerVisibilityContextValue {
  state: BannerVisibilityState;
  isHydrated: boolean;
  dispatch: Dispatch<BannerVisibilityAction>;
  dismissModal: (bannerId: string) => void;
  dismissPersistent: (bannerId: string) => void;
}

function isBannerVisibilityState(x: unknown): x is BannerVisibilityState {
  if (!x || typeof x !== "object") return false;
  const s = x as Record<string, unknown>;
  return (
    (s.dismissedModalBannerId === null || typeof s.dismissedModalBannerId === "string") &&
    (s.dismissedPersistentBannerId === null || typeof s.dismissedPersistentBannerId === "string")
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
      return { ...state, dismissedPersistentBannerId: action.bannerId };
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
    dismissedPersistentBannerId: null,
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

  const dismissPersistent = (bannerId: string) => {
    dispatch({ type: "DISMISS_PERSISTENT", bannerId });
  };

  return (
    <BannerVisibilityContext.Provider
      value={{ state, isHydrated, dispatch, dismissModal, dismissPersistent }}
    >
      {children}
    </BannerVisibilityContext.Provider>
  );
}
