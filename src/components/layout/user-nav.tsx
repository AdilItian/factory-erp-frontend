'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useRouter } from 'next/navigation';
import { clearAuthData } from '@/lib/auth-storage';
import { getAuthUser } from '@/features/auth/utils/get-auth-user';
import { PATHS } from '@/lib/pages-path';

export function UserNav() {
  const router = useRouter();
  const authUser = getAuthUser();
  const user = {
    imageUrl: authUser.imageUrl,
    fullName: authUser.email || authUser.name || '',
    emailAddresses: [{ emailAddress: authUser.name || '' }]
  };

  function handleLogout() {
    clearAuthData();
    router.push(PATHS.REDIRECT_AFTER_LOGOUT);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant='ghost' className='relative h-8 w-8 rounded-full' />}
      >
        <UserAvatarProfile user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' sideOffset={10}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>{user.fullName}</p>
              <p className='text-muted-foreground text-xs leading-none'>
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/notifications')}>
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
