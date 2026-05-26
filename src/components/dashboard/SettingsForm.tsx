'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { selectPreferences, updatePreferences } from '@/features/preferences/preferencesSlice';
import { CATEGORIES } from '@/constants';
import { Save, Settings, ToggleLeft, ToggleRight, Layout, Sliders } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';

const settingsSchema = z.object({
  favoriteCategories: z.array(z.string()).min(1, 'Select at least one category'),
  language: z.enum(['en', 'hi']),
  theme: z.enum(['light', 'dark']),
  compactMode: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const preferences = useAppSelector(selectPreferences);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      favoriteCategories: preferences.favoriteCategories,
      language: preferences.language,
      theme: preferences.theme,
      compactMode: preferences.compactMode,
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    // Save to Redux state
    dispatch(updatePreferences(data));
    
    // Set language reactively
    i18n.changeLanguage(data.language);
    
    // Set html element class for theme
    const root = window.document.documentElement;
    if (data.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    toast.success(t('settings.savedSuccess'));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" />
          {t('settings.title')}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Adjust feed contents, localization dictionaries, visual spacing, and themes.
        </p>
      </div>

      {/* Form Panel */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card/45 border border-border p-6 rounded-2xl glass shadow-xl">
        
        {/* Favorite Categories */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-primary" />
              {t('settings.categoriesLabel')}
            </label>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('settings.categoriesDesc')}
            </p>
          </div>

          <Controller
            name="favoriteCategories"
            control={control}
            render={({ field }) => {
              const checkedValues = field.value || [];
              
              const handleCheckboxChange = (category: string) => {
                const updated = checkedValues.includes(category)
                  ? checkedValues.filter((v) => v !== category)
                  : [...checkedValues, category];
                field.onChange(updated);
              };

              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {CATEGORIES.map((cat) => {
                    const isChecked = checkedValues.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCheckboxChange(cat)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-primary/10 border-primary text-primary shadow-sm'
                            : 'bg-card border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="capitalize">{t(`categories.${cat}`, cat)}</span>
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isChecked ? 'border-primary bg-primary text-white' : 'border-muted-foreground/35'
                        }`}>
                          {isChecked && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            }}
          />
          {errors.favoriteCategories && (
            <span className="text-xs text-destructive font-semibold">
              {errors.favoriteCategories.message}
            </span>
          )}
        </div>

        {/* Theme and Language Selection Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border/40">
          {/* Theme Switcher */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              {t('settings.themeLabel')}
            </label>
            <Controller
              name="theme"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  {['light', 'dark'].map((themeVal) => (
                    <button
                      type="button"
                      key={themeVal}
                      onClick={() => field.onChange(themeVal)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        field.value === themeVal
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-card border-border hover:bg-muted/40 text-muted-foreground'
                      }`}
                    >
                      {themeVal === 'light' ? t('settings.themeLight') : t('settings.themeDark')}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Language Switcher */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              {t('settings.langLabel')}
            </label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => field.onChange('en')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      field.value === 'en'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-card border-border hover:bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange('hi')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      field.value === 'hi'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-card border-border hover:bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              )}
            />
          </div>
        </div>

        {/* Card Spacing density (Compact mode) */}
        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Layout className="h-4 w-4 text-primary" />
              {t('settings.compactLabel')}
            </label>
            <p className="text-xs text-muted-foreground">
              Simplify feed card elements for high density views.
            </p>
          </div>
          <Controller
            name="compactMode"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className="text-primary hover:scale-105 transition-transform duration-200 cursor-pointer"
                aria-label="Toggle compact view"
              >
                {field.value ? (
                  <ToggleRight className="h-10 w-10 text-primary" />
                ) : (
                  <ToggleLeft className="h-10 w-10 text-muted-foreground" />
                )}
              </button>
            )}
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-border/40 flex justify-end">
          <Button type="submit" variant="primary" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {t('settings.saveBtn')}
          </Button>
        </div>

      </form>
    </div>
  );
}
export default SettingsForm;
