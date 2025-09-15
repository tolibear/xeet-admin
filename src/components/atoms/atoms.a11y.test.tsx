/**
 * Accessibility tests for atomic components
 * Ensures WCAG 2.1 AA compliance across all atoms
 */

import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { User, TrendingUp } from 'lucide-react';

import { 
  Button, 
  Input, 
  Badge, 
  StatusDot, 
  MetricValue, 
  Icon, 
  Avatar, 
  AvatarImage, 
  AvatarFallback,
  Spinner 
} from './index';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Atomic Components Accessibility', () => {
  describe('Button', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <div>
          <Button>Default Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button disabled>Disabled Button</Button>
          <Button loading>Loading Button</Button>
          <Button loading loadingText="Saving...">Save</Button>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes when loading', () => {
      render(<Button loading>Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeDisabled();
    });

    it('should have proper ARIA attributes when disabled', () => {
      render(<Button disabled>Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeDisabled();
    });
  });

  describe('Input', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-input">Test Input</label>
          <Input id="test-input" placeholder="Enter text" />
          
          <label htmlFor="error-input">Error Input</label>
          <Input id="error-input" error="This field is required" />
          
          <label htmlFor="loading-input">Loading Input</label>
          <Input id="loading-input" loading />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes for error state', () => {
      render(<Input error="This field is required" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby');
      
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('This field is required');
    });

    it('should have proper ARIA attributes when loading', () => {
      render(<Input loading />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('Badge', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <div>
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge loading>Loading</Badge>
          <Badge disabled>Disabled</Badge>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper role and ARIA attributes', () => {
      render(<Badge>Status Badge</Badge>);
      const badge = screen.getByText('Status Badge');
      expect(badge).toHaveAttribute('role', 'status');
    });

    it('should have proper ARIA attributes when loading', () => {
      render(<Badge loading>Loading Badge</Badge>);
      const badge = screen.getByText('Loading Badge');
      expect(badge).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('StatusDot', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <div>
          <StatusDot variant="success" label="Online" />
          <StatusDot variant="warning" label="Away" />
          <StatusDot variant="error" label="Offline" />
          <StatusDot animation="pulse" label="Connecting" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper role and ARIA attributes', () => {
      render(<StatusDot variant="success" label="Online status" />);
      const statusDot = screen.getByLabelText('Online status');
      expect(statusDot).toHaveAttribute('role', 'status');
    });
  });

  describe('MetricValue', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <div>
          <MetricValue value={1234} />
          <MetricValue value={98.5} suffix="%" />
          <MetricValue value={500} prefix="$" />
          <MetricValue value={0} loading />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA label for screen readers', () => {
      render(<MetricValue value={1234} prefix="$" suffix=" USD" />);
      const metric = screen.getByLabelText('$1,234 USD');
      expect(metric).toBeInTheDocument();
    });

    it('should have proper loading state', () => {
      render(<MetricValue value={100} loading />);
      const metric = screen.getByLabelText('Loading metric value');
      expect(metric).toHaveTextContent('--');
    });
  });

  describe('Icon', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <div>
          <Icon icon={User} />
          <Icon icon={TrendingUp} variant="primary" />
          <Icon icon={User} loading />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should be hidden from screen readers', () => {
      render(<Icon icon={User} />);
      const icon = document.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Avatar', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <div>
          <Avatar>
            <AvatarImage src="/avatar.jpg" alt="User avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper alt text for images', () => {
      render(
        <Avatar>
          <AvatarImage src="/avatar.jpg" alt="John Doe's avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      const image = screen.getByAltText("John Doe's avatar");
      expect(image).toBeInTheDocument();
    });
  });

  describe('Spinner', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <div>
          <Spinner />
          <Spinner label="Loading data" />
          <Spinner size="lg" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper role and ARIA attributes', () => {
      render(<Spinner label="Loading content" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading content');
      
      const hiddenText = screen.getByText('Loading content');
      expect(hiddenText).toHaveClass('sr-only');
    });
  });

  describe('Color Contrast', () => {
    it('should meet WCAG AA color contrast requirements', async () => {
      // This test would typically use a color contrast checking library
      // For now, we ensure our design tokens meet requirements
      const { container } = render(
        <div className="bg-background text-foreground">
          <Button>Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Error</Badge>
        </div>
      );
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support proper keyboard navigation', () => {
      render(
        <div>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Input placeholder="Text input" />
        </div>
      );

      // All interactive elements should be focusable
      const button1 = screen.getByText('Button 1');
      const button2 = screen.getByText('Button 2');
      const input = screen.getByPlaceholderText('Text input');

      expect(button1).toHaveAttribute('tabIndex', '0');
      expect(button2).toHaveAttribute('tabIndex', '0');
      expect(input).not.toHaveAttribute('tabIndex', '-1');
    });
  });
});
