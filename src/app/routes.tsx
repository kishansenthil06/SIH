import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { PlatformHubWorkspace } from '../workspaces/overview/PlatformHubWorkspace';
import { CopilotWorkspace } from '../workspaces/copilot/CopilotWorkspace';
import { MapExplorerWorkspace } from '../workspaces/map-explorer/MapExplorerWorkspace';
import { SpeciesProfileWorkspace } from '../workspaces/species-profile/SpeciesProfileWorkspace';
import { OtolithLabWorkspace } from '../workspaces/otolith-lab/OtolithLabWorkspace';
import { EdnaLabWorkspace } from '../workspaces/edna-lab/EdnaLabWorkspace';
import { IngestionConsoleWorkspace } from '../workspaces/ingestion-console/IngestionConsoleWorkspace';
import { ReportBuilderWorkspace } from '../workspaces/report-builder/ReportBuilderWorkspace';
import { ReportPrintView } from '../workspaces/report-builder/ReportPrintView';

export const router = createBrowserRouter([
  {
    path: '/landing',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/report/print',
    element: <ReportPrintView />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <PlatformHubWorkspace /> },
      { path: 'overview', element: <PlatformHubWorkspace /> },
      { path: 'map', element: <MapExplorerWorkspace /> },
      { path: 'species', element: <SpeciesProfileWorkspace /> },
      { path: 'edna-lab', element: <EdnaLabWorkspace /> },
      { path: 'copilot', element: <CopilotWorkspace /> },
      { path: 'otolith-lab', element: <OtolithLabWorkspace /> },
      { path: 'ingestion', element: <IngestionConsoleWorkspace /> },
      { path: 'report', element: <ReportBuilderWorkspace /> },
    ],
  },
]);
