import { apiClient } from './client';
import { UserOnboarding } from '@/store/useAuthStore';

export interface OnboardingStatusData {
  completed: boolean;
  nextStep: string;
  language: string | null;
  category: string | null;
  profileComplete: boolean;
}

export interface OnboardingStatusResponse {
  success: boolean;
  message: string;
  data: OnboardingStatusData;
}

/**
 * Fetch current user onboarding progress and next step:
 * GET http://130.210.30.199/api/v1/onboarding/status
 * Authorization: Bearer <accessToken>
 */
export async function getOnboardingStatusApi(token?: string): Promise<OnboardingStatusResponse> {
  return apiClient<OnboardingStatusResponse>('/onboarding/status', {
    method: 'GET',
    token,
  });
}

export function getRouteForOnboardingStep(status: UserOnboarding | OnboardingStatusData | any): string {
  const nextStep = (status.nextStep || '').toUpperCase();
  if (status.completed || nextStep === 'DASHBOARD' || nextStep === 'HOME') {
    return '/(tabs)/home';
  }

  if (nextStep === 'LANGUAGE') {
    return '/(auth)/language';
  }

  if (nextStep === 'STAGE' || nextStep === 'CATEGORY') {
    return '/(auth)/stage';
  }

  const rawCat = typeof status.category === 'object' && status.category !== null
    ? (status.category.code || status.category.name || '')
    : (status.category || '');
  const category = String(rawCat).toLowerCase();

  if (nextStep === 'PROFILE' || nextStep === 'DETAILS' || category) {
    if (category.includes('conceive')) {
      return '/(auth)/conceive';
    }
    if (category.includes('pregnant') || category.includes('pregnancy')) {
      return '/(auth)/pregnancy';
    }
    if (category.includes('mother') || category.includes('post')) {
      return '/(auth)/baby-gender';
    }
    if (category.includes('ivf') || category.includes('explore') || category.includes('iui')) {
      return '/(auth)/iui-ivf';
    }
    return '/(auth)/stage';
  }

  // Fallbacks
  if (!status.language) {
    return '/(auth)/language';
  }
  if (!status.category) {
    return '/(auth)/stage';
  }

  return '/(tabs)/home';
}

export interface OnboardingLanguage {
  id: number;
  code: string;
  name: string;
}

export interface OnboardingLanguagesResponse {
  success: boolean;
  message: string;
  data: OnboardingLanguage[];
}

/**
 * Fetch available languages from backend:
 * GET http://130.210.30.199/api/v1/onboarding/languages
 * Header: Authorization: Bearer <accessToken>
 */
export async function getOnboardingLanguagesApi(token?: string): Promise<OnboardingLanguagesResponse> {
  return apiClient<OnboardingLanguagesResponse>('/onboarding/languages', {
    method: 'GET',
    token,
  });
}

export interface SelectLanguagePayload {
  languageCode: string;
}

export interface SelectLanguageResponse {
  success: boolean;
  message: string;
  data: {
    completed: boolean;
    nextStep: string;
    language: {
      id: number;
      code: string;
      name: string;
    };
    category: string | null;
    profileComplete: boolean;
  };
}

/**
 * Select user language during onboarding:
 * PUT http://130.210.30.199/api/v1/onboarding/language
 * Header: Authorization: Bearer <accessToken>
 */
export async function selectLanguageApi(
  payload: SelectLanguagePayload,
  token?: string
): Promise<SelectLanguageResponse> {
  return apiClient<SelectLanguageResponse>('/onboarding/language', {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export interface OnboardingCategory {
  id: number;
  code: string;
  name: string;
}

export interface OnboardingCategoriesResponse {
  success: boolean;
  message: string;
  data: OnboardingCategory[];
}

/**
 * Fetch available onboarding categories/stages from backend:
 * GET http://130.210.30.199/api/v1/onboarding/categories
 * Header: Authorization: Bearer <accessToken>
 */
export async function getOnboardingCategoriesApi(token?: string): Promise<OnboardingCategoriesResponse> {
  return apiClient<OnboardingCategoriesResponse>('/onboarding/categories', {
    method: 'GET',
    token,
  });
}

export interface SelectCategoryPayload {
  categoryCode: string;
}

export interface SelectCategoryResponse {
  success: boolean;
  message: string;
  data: {
    completed: boolean;
    nextStep: string;
    language?: any;
    category?: {
      id: number;
      code: string;
      name: string;
    };
    profileComplete: boolean;
  };
}

/**
 * Select user category/stage during onboarding:
 * PUT http://130.210.30.199/api/v1/onboarding/category
 * Header: Authorization: Bearer <accessToken>
 */
export async function selectCategoryApi(
  payload: SelectCategoryPayload,
  token?: string
): Promise<SelectCategoryResponse> {
  return apiClient<SelectCategoryResponse>('/onboarding/category', {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export interface ConceiveProfilePayload {
  heightCm?: number | null;
  weightKg?: number | null;
  bloodGroup?: string | null;
  diabetic: boolean;
  bloodPressure: 'LOW' | 'NORMAL' | 'HIGH';
  lastPeriodDate: string; // YYYY-MM-DD
}

export interface ConceiveProfileResponse {
  success: boolean;
  message: string;
  data: {
    completed: boolean;
    nextStep: string;
    language: {
      id: number;
      code: string;
      name: string;
    };
    category: {
      id: number;
      code: string;
      name: string;
    };
    profileComplete: boolean;
  };
}

/**
 * Save Conceive Profile:
 * PUT http://130.210.30.199/api/v1/onboarding/profile/conceive
 * Header: Authorization: Bearer <accessToken>
 */
export async function saveConceiveProfileApi(
  payload: ConceiveProfilePayload,
  token?: string
): Promise<ConceiveProfileResponse> {
  return apiClient<ConceiveProfileResponse>('/onboarding/profile/conceive', {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export interface MotherProfilePayload {
  motherHeightCm?: number | null;
  motherWeightKg?: number | null;
  babyHeightCm?: number | null;
  babyWeightKg?: number | null;
  babyGender: 'BOY' | 'GIRL';
  bloodGroup?: string | null;
  diabetic: boolean;
  bloodPressure: 'LOW' | 'NORMAL' | 'HIGH';
  babyDateOfBirth: string; // YYYY-MM-DD
}

export interface MotherProfileResponse {
  success: boolean;
  message: string;
  data: {
    completed: boolean;
    nextStep: string;
    language?: any;
    category?: any;
    profileComplete: boolean;
  };
}

/**
 * Save Post-Pregnancy (Mother) Profile:
 * PUT http://130.210.30.199/api/v1/onboarding/profile/mother
 * Header: Authorization: Bearer <accessToken>
 */
export async function saveMotherProfileApi(
  payload: MotherProfilePayload,
  token?: string
): Promise<MotherProfileResponse> {
  return apiClient<MotherProfileResponse>('/onboarding/profile/mother', {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export interface PregnancyProfilePayload {
  heightCm?: number | null;
  weightKg?: number | null;
  bloodGroup?: string | null;
  diabetic: boolean;
  bloodPressure: 'LOW' | 'NORMAL' | 'HIGH';
  expectedDeliveryDate: string; // YYYY-MM-DD
}

export interface PregnancyProfileResponse {
  success: boolean;
  message: string;
  data: {
    completed: boolean;
    nextStep: string;
    language?: any;
    category?: any;
    profileComplete: boolean;
  };
}

/**
 * Save Pregnancy Profile:
 * PUT http://130.210.30.199/api/v1/onboarding/profile/pregnancy
 * Header: Authorization: Bearer <accessToken>
 */
export async function savePregnancyProfileApi(
  payload: PregnancyProfilePayload,
  token?: string
): Promise<PregnancyProfileResponse> {
  return apiClient<PregnancyProfileResponse>('/onboarding/profile/pregnancy', {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export interface IuiIvfProfilePayload {
  heightCm?: number | null;
  weightKg?: number | null;
  bloodGroup?: string | null;
  diabetic: boolean;
  bloodPressure: 'LOW' | 'NORMAL' | 'HIGH';
  lastPeriodDate: string; // YYYY-MM-DD
}

export interface IuiIvfProfileResponse {
  success: boolean;
  message: string;
  data: {
    completed: boolean;
    nextStep: string;
    language?: any;
    category?: any;
    profileComplete: boolean;
  };
}

/**
 * Save IUI/IVF Profile:
 * PUT http://130.210.30.199/api/v1/onboarding/profile/iui-ivf
 * Header: Authorization: Bearer <accessToken>
 */
export async function saveIuiIvfProfileApi(
  payload: IuiIvfProfilePayload,
  token?: string
): Promise<IuiIvfProfileResponse> {
  return apiClient<IuiIvfProfileResponse>('/onboarding/profile/iui-ivf', {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}





