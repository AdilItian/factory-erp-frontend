'use client';

import { useState, useCallback } from 'react';
import { NO_VALUE_OPERATORS } from './filter-schema';

export const WIZARD_STEPS = {
  FIELD: 'field',
  OPERATOR: 'operator',
  VALUE: 'value'
};

/**
 * Manages the 3-step wizard state: field → operator → value.
 * Also handles edit mode when user clicks an existing chip.
 */
export function useFilterWizard({ onApply, onRemove }) {
  const [step, setStep] = useState(WIZARD_STEPS.FIELD);
  const [draft, setDraft] = useState({ id: null, op: null, v: null });
  const [editingIndex, setEditingIndex] = useState(null);

  const reset = useCallback(() => {
    setStep(WIZARD_STEPS.FIELD);
    setDraft({ id: null, op: null, v: null });
    setEditingIndex(null);
  }, []);

  const selectField = useCallback((fieldId) => {
    setDraft({ id: fieldId, op: null, v: null });
    setStep(WIZARD_STEPS.OPERATOR);
  }, []);

  const selectOperator = useCallback(
    (op) => {
      const updatedDraft = { ...draft, op, v: null };
      setDraft(updatedDraft);

      if (NO_VALUE_OPERATORS.has(op)) {
        onApply(updatedDraft, editingIndex);
        reset();
      } else {
        setStep(WIZARD_STEPS.VALUE);
      }
    },
    [draft, editingIndex, onApply, reset]
  );

  const setValue = useCallback((v) => {
    setDraft((prev) => ({ ...prev, v }));
  }, []);

  const applyFilter = useCallback(() => {
    if (!draft.id || !draft.op) return;
    onApply(draft, editingIndex);
    reset();
  }, [draft, editingIndex, onApply, reset]);

  const editFilter = useCallback((condition, index) => {
    setDraft(condition);
    setEditingIndex(index);
    setStep(WIZARD_STEPS.VALUE);
  }, []);

  const goToStep = useCallback(
    (targetStep) => {
      if (targetStep === WIZARD_STEPS.FIELD) {
        setDraft({ id: null, op: null, v: null });
        setStep(WIZARD_STEPS.FIELD);
      } else if (targetStep === WIZARD_STEPS.OPERATOR && draft.id) {
        setDraft((prev) => ({ ...prev, op: null, v: null }));
        setStep(WIZARD_STEPS.OPERATOR);
      }
    },
    [draft.id]
  );

  const goBack = useCallback(() => {
    if (step === WIZARD_STEPS.VALUE) {
      setStep(WIZARD_STEPS.OPERATOR);
      setDraft((prev) => ({ ...prev, op: null, v: null }));
    } else if (step === WIZARD_STEPS.OPERATOR) {
      setStep(WIZARD_STEPS.FIELD);
      setDraft({ id: null, op: null, v: null });
    }
  }, [step]);

  return {
    step,
    draft,
    editingIndex,
    reset,
    selectField,
    selectOperator,
    setValue,
    applyFilter,
    editFilter,
    goToStep,
    goBack
  };
}
