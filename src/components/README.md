# Xeet Admin Platform - Atomic Design System

This directory contains all UI components organized using **Atomic Design methodology**, ensuring consistent, scalable, and maintainable components from the smallest atoms to complete galaxy-scale systems.

## 🏗️ Atomic Design Hierarchy

```
🌌 Galaxy    - Complete application ecosystems (App-level routing, state)
🌟 Systems   - Feature-complete modules (Research Hub, Leaderboards)
🏛️  Templates - Page layouts and complex compositions
🧬 Organisms - Complex UI components (DataTable, ChartBuilder)
🔬 Molecules - Simple UI components (SearchBox, FilterChip)
⚛️  Atoms     - Basic building blocks (Button, Input, Icon)
```

## 📁 Directory Structure

```
/components
├── README.md                    # This file
├── index.ts                    # Main export file
├── /atoms                      # ⚛️  Basic building blocks
│   ├── index.ts               # Atoms exports
│   ├── /Button                # Enhanced shadcn/ui Button
│   ├── /StatusDot             # Custom status indicator
│   └── /MetricValue           # Formatted metric display
├── /molecules                  # 🔬 Simple compositions
│   ├── index.ts               # Molecules exports
│   ├── /SearchBox             # Input + Button + Clear
│   ├── /FilterChip            # Badge + CloseButton
│   └── /MetricCard            # Icon + Value + Label + Change
├── /organisms                  # 🧬 Complex business components
│   ├── index.ts               # Organisms exports
│   ├── /DataTable             # Virtualized data table
│   ├── /ChartBuilder          # Chart composition tool
│   └── /ScoreInspector        # Score breakdown display
├── /templates                  # 🏛️  Page layouts
│   ├── index.ts               # Templates exports
│   ├── /DashboardTemplate     # Dashboard page layout
│   └── /ListPageTemplate      # List page layout
├── /systems                    # 🌟 Complete features
│   ├── index.ts               # Systems exports
│   ├── /ResearchHub           # Research feature system
│   └── /LeaderboardSystem     # Leaderboard management
└── /ui                        # shadcn/ui components
    ├── button.tsx
    ├── input.tsx
    └── card.tsx
```

## 🎯 Component Guidelines

### ⚛️ Atoms (Level 1)

- **Purpose**: Fundamental building blocks
- **Dependencies**: Zero component dependencies
- **States**: Must handle ALL states (loading, error, disabled, hover, focus)
- **Accessibility**: WCAG 2.1 AA compliant
- **Testing**: 100% test coverage required
- **Examples**: Button, Input, Badge, Icon, StatusDot

**Rules:**

- Cannot be broken down further
- Work in complete isolation
- Perfect keyboard navigation
- All variants documented in Storybook

### 🔬 Molecules (Level 2)

- **Purpose**: Simple atom combinations with focused responsibility
- **Dependencies**: 2-5 atoms maximum
- **States**: Handle molecule-level states
- **Reusability**: Work in any context without modification
- **Examples**: SearchBox, FilterChip, MetricCard

**Rules:**

- Single responsibility principle
- No prop drilling between atoms
- Compose atoms, don't modify them
- Reusable across different contexts

### 🧬 Organisms (Level 3)

- **Purpose**: Complex business logic components
- **Dependencies**: Multiple molecules and atoms
- **States**: Handle own data and state management
- **Performance**: Optimized for galaxy scale (100k+ rows)
- **Examples**: DataTable, ChartBuilder, ScoreInspector

**Rules:**

- Feature-complete business functionality
- Handle data fetching and state
- Error handling and loading states
- Performance optimizations (virtualization, memoization)

### 🏛️ Templates (Level 4)

- **Purpose**: Page-level structural layouts
- **Dependencies**: Organisms, molecules, atoms
- **Content**: No business logic or content
- **Responsive**: Multi-device layout patterns
- **Examples**: DashboardTemplate, ListPageTemplate

**Rules:**

- Layout structure only, no content
- Flexible component slots
- Accessibility-first design
- Responsive by default

### 🌟 Systems (Level 5)

- **Purpose**: Complete feature modules
- **Dependencies**: All lower levels
- **Scale**: Galaxy-scale performance (500k+ records)
- **Integration**: Cross-system compatibility
- **Examples**: ResearchHub, LeaderboardSystem

**Rules:**

- Complete user workflows
- Handle all edge cases
- Real-time updates where needed
- Multi-tenant awareness

## 📋 Component Creation Checklist

### For Every Component:

- [ ] TypeScript interfaces defined
- [ ] All states handled (loading, error, disabled)
- [ ] Accessibility attributes (ARIA labels, roles)
- [ ] Keyboard navigation support
- [ ] Unit tests with high coverage
- [ ] Storybook stories with all variants
- [ ] Performance considerations
- [ ] Error boundaries where appropriate

### Atomic-Specific:

- [ ] **Atoms**: Zero dependencies, perfect isolation
- [ ] **Molecules**: 2-5 atoms max, single responsibility
- [ ] **Organisms**: Business logic, data handling
- [ ] **Templates**: Layout only, no business logic
- [ ] **Systems**: Complete workflows, galaxy-scale

## 🔧 Usage Examples

### Basic Atom Usage

```tsx
import { Button } from "@/components";

<Button variant="primary" size="lg" disabled={loading}>
  Save Changes
</Button>;
```

### Molecule Composition

```tsx
import { SearchBox } from "@/components";

<SearchBox
  placeholder="Search posts..."
  onSearch={handleSearch}
  onClear={handleClear}
  loading={isSearching}
/>;
```

### Organism Implementation

```tsx
import { DataTable } from "@/components";

<DataTable
  data={posts}
  columns={postColumns}
  virtualized={posts.length > 1000}
  onSelectionChange={handleSelection}
  loading={isLoading}
  error={error}
/>;
```

### System Integration

```tsx
import { ResearchHub } from "@/components";

<ResearchHub orgId="test-org" initialView="default" onViewSave={handleViewSave} />;
```

## 🎨 Styling Guidelines

### Tailwind Classes

- Use design tokens from `@/lib/design-tokens`
- Consistent spacing with atomic scale
- Dark theme optimized colors
- Responsive modifiers for all breakpoints

### Component Variants

- Use `class-variance-authority` for systematic variants
- Support size, variant, and state props
- Maintain consistency across atomic levels

### Performance

- Use `cn()` utility for className merging
- Avoid unnecessary re-renders with `React.memo`
- Optimize large lists with virtualization
- Implement proper loading and error states

## 🧪 Testing Strategy

### Test Organization

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
└── index.ts
```

### Coverage Requirements

- **Atoms**: 100% coverage (critical foundation)
- **Molecules**: 95% coverage (reusable components)
- **Organisms**: 90% coverage (business logic)
- **Templates**: 85% coverage (layout patterns)
- **Systems**: 80% coverage (integration complexity)

### Test Types

- Unit tests for all components
- Integration tests for organisms and systems
- Visual regression tests via Storybook
- Accessibility tests with @testing-library/jest-dom
- Performance tests for galaxy-scale components

## 📚 Documentation

All components must be documented in:

1. **Storybook** - Interactive component playground
2. **TypeScript** - Comprehensive type definitions
3. **README** - Usage examples and guidelines
4. **Tests** - Behavioral specifications

## 🚀 Performance Targets

- **Initial TTI**: < 3 seconds
- **Component Rendering**: < 100ms for organisms
- **Table Interactions**: < 250ms for 100k rows
- **Bundle Size**: Optimized with tree-shaking
- **Memory Usage**: Efficient for galaxy-scale data

---

This atomic design system ensures that every component is built to scale from individual atoms to complete galaxy-scale systems, maintaining consistency, performance, and maintainability throughout the Xeet Admin Platform.
