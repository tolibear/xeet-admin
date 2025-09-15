/**
 * Atomic Design Level: ATOMS
 *
 * Fundamental building blocks that cannot be broken down further.
 * Must work in isolation with zero dependencies.
 * Handle all possible states (loading, error, disabled, etc.)
 * Perfect accessibility and keyboard navigation.
 *
 * Examples: Button, Input, Badge, Icon, StatusDot, MetricValue
 *
 * Principles:
 * - Single responsibility
 * - Zero dependencies on other components
 * - All states handled (loading, error, disabled, hover, focus)
 * - Perfect accessibility compliance
 * - Keyboard navigation support
 * - WCAG 2.1 AA compliant
 */

// Re-export shadcn/ui atoms (enhanced with all states)
export { Button } from "../ui/button";
export { Input } from "../ui/input";
export { Badge } from "../ui/badge";
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../ui/card";

// Custom atomic components
export { StatusDot } from "./StatusDot";
export { MetricValue } from "./MetricValue";
export { Icon } from "./Icon";
export { Avatar, AvatarImage, AvatarFallback } from "./Avatar";
export { Spinner } from "./Spinner";
export { ColorPicker } from "./ColorPicker";
export { HeatmapCell } from "./HeatmapCell";
export { HeatmapLegend } from "./HeatmapLegend";
