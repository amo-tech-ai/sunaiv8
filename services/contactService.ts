
import React from 'react';
import { Contact, Interaction, Deal, PipelineStage, EnrichmentSuggestion, FocusState } from '../types';

/**
 * Updates a contact in the list and ensures the active focus state stays in sync.
 */
export const updateContactInList = (
  contacts: Contact[],
  contactId: string,
  updates: Partial<Contact>,
  focus: FocusState,
  setFocus: React.Dispatch<React.SetStateAction<FocusState>>
): Contact[] => {
  return contacts.map(c => {
    if (c.id === contactId) {
      const updated = { ...c, ...updates };
      // Sync focus data if this is the active focused item
      if (focus.id === contactId) {
        setFocus(f => ({ ...f, data: updated }));
      }
      return updated;
    }
    return c;
  });
};

/**
 * Core business logic for applying AI enrichment to a contact.
 */
export const applyEnrichmentLogic = (
  contacts: Contact[],
  leadId: string,
  fields: Partial<EnrichmentSuggestion>,
  focus: FocusState,
  setFocus: React.Dispatch<React.SetStateAction<FocusState>>
): Contact[] => {
  return updateContactInList(
    contacts,
    leadId,
    {
      role: fields.contactPosition || undefined,
      bio: fields.companyDescription || undefined,
      category: (fields.industry as any) || undefined,
      pendingEnrichment: undefined
    },
    focus,
    setFocus
  );
};

/**
 * Logic for logging a new interaction and updating the relationship score.
 */
export const logInteractionLogic = (
  contacts: Contact[],
  contactId: string,
  interaction: Interaction,
  focus: FocusState,
  setFocus: React.Dispatch<React.SetStateAction<FocusState>>
): Contact[] => {
  return updateContactInList(
    contacts,
    contactId,
    {
      interactions: [interaction, ...(contacts.find(c => c.id === contactId)?.interactions || [])],
      lastContact: 'Just now',
      score: Math.min(100, ((contacts.find(c => c.id === contactId)?.score || 50) + 5))
    },
    focus,
    setFocus
  );
};
