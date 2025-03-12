import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  Input, 
  Button, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  DropdownSection,
  Avatar,
  User
} from '@heroui/react';

interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onToggleSidebar: () => void;
}

export default function DashboardHeader({ 
  searchTerm, 
  onSearchChange,
  onToggleSidebar
}: DashboardHeaderProps) {
  const { data: session } = useSession();

  return (
    <Navbar maxWidth="full" className="border-b border-gray-200 bg-white">
      <NavbarContent className="sm:hidden" justify="start">
        <Button 
          isIconOnly 
          variant="light" 
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <AdjustmentsHorizontalIcon className="h-6 w-6" />
        </Button>
      </NavbarContent>
      
      <NavbarBrand>
        <h1 className="text-xl font-bold text-blue-600">DARCO Dev Vault</h1>
      </NavbarBrand>
      
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[20rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Search resources..."
          size="sm"
          startContent={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
          type="search"
          value={searchTerm}
          onValueChange={onSearchChange}
        />
      </NavbarContent>
      
      <NavbarContent justify="end">
        <Button 
          isIconOnly 
          variant="light" 
          aria-label="Notifications"
        >
          <BellIcon className="h-6 w-6 text-gray-400" />
        </Button>
        
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              showFallback
              size="sm"
              name={session?.user?.name || 'User'}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User menu">
            <DropdownSection showDivider>
              <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile">
                <User
                  name={session?.user?.name || 'User'}
                  description={session?.user?.email || ''}
                  classNames={{
                    name: "text-default-600",
                    description: "text-default-500",
                  }}
                />
              </DropdownItem>
            </DropdownSection>
            <DropdownItem key="settings">Settings</DropdownItem>
            <DropdownItem key="profile_settings">Your Profile</DropdownItem>
            <DropdownItem key="logout" color="danger" href="/api/auth/signout">
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      
      {/* Mobile search - visible only on small screens */}
      <NavbarContent className="sm:hidden pt-2 pb-3" justify="center">
        <Input
          fullWidth
          placeholder="Search resources..."
          size="sm"
          startContent={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
          type="search"
          value={searchTerm}
          onValueChange={onSearchChange}
        />
      </NavbarContent>
    </Navbar>
  );
} 