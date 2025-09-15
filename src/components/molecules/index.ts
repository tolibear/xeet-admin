/**
 * Atomic Design Level: MOLECULES
 *
 * Simple combinations of atoms with specific purpose.
 * Composed of 2-5 atoms maximum.
 * Single responsibility principle.
 * Reusable across different contexts.
 *
 * Examples: SearchBox, FilterChip, MetricCard, StatePill, OrgSwitcher
 *
 * Principles:
 * - Maximum 5 atoms per molecule
 * - Single, focused responsibility
 * - Reusable in any context
 * - No prop drilling between atoms
 * - Compose atoms, don't modify them
 * - Handle molecule-level states
 */

// Molecules - Simple atomic compositions  
export { SearchBox } from "./SearchBox";
export { FilterChip } from "./FilterChip";
export { MetricCard } from "./MetricCard";
export { StatePill } from "./StatePill";
export { OrgSwitcher } from "./OrgSwitcher";
export { KeywordInput, KeywordChip } from "./KeywordInput";
export { PillFilter, PillFilterGroup } from "./PillFilter";
