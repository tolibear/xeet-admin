/**
 * Xeet Admin Platform - Atomic Design Component Export
 *
 * This is the main entry point for all components organized by atomic design principles.
 * Components are structured from atoms (smallest) to systems (largest/most complex).
 *
 * Usage:
 * import { Button } from '@/components'; // Atom
 * import { SearchBox } from '@/components'; // Molecule
 * import { DataTable } from '@/components'; // Organism
 * import { DashboardTemplate } from '@/components'; // Template
 * import { ResearchHub } from '@/components'; // System
 */

// Atomic Level Exports (includes all shadcn/ui components properly organized)
export * from "./atoms";
export * from "./molecules";
export * from "./organisms";
export * from "./templates";
// export * from "./systems";       // Will be enabled when systems are added
