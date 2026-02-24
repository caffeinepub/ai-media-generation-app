import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <RouterProvider router={router} />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: 'oklch(0.16 0.008 240)',
            border: '1px solid oklch(0.35 0.02 175 / 0.3)',
            color: 'oklch(0.95 0.01 240)',
          },
        }}
      />
    </ThemeProvider>
  );
}
