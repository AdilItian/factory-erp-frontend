'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

function getInitials(email) {
  if (!email) return 'U';

  const localPart = email.split('@')[0] || email;
  return localPart.slice(0, 2).toUpperCase();
}

export default function SidebarUserProfile({ user, avatarClassName = 'h-8 w-8 rounded-lg' }) {
  return (
    <div className='flex min-w-0 items-center gap-2'>
      <Avatar className={avatarClassName}>
        <AvatarImage src={user.imageUrl || ''} alt={user.email || 'User'} />
        <AvatarFallback className='rounded-lg'>{getInitials(user.email)}</AvatarFallback>
      </Avatar>
      <div className='grid min-w-0 flex-1 gap-1.5 group-data-[collapsible=icon]:hidden'>
        {user.email ? (
          <div className='flex flex-wrap gap-1'>
            <Badge variant='outline' className='max-w-full truncate text-[10px]'>
              {user.email}
            </Badge>
          </div>
        ) : null}
        {user.roles?.length > 0 ? (
          <div className='flex flex-wrap gap-1'>
            {user.roles.map((role) => (
              <Badge key={role} variant='secondary' className='text-[10px] capitalize'>
                {role}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
