import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useEffect, useState } from 'react';

import { UserEntity } from '@backstage/catalog-model';
import { SearchField, Avatar } from '@backstage/ui';
import { List, ListItemAvatar, ListItemText, Paper } from '@material-ui/core';
import ListItemButton from '@mui/material/ListItemButton';

interface OwnerSearchProps {
  value?: string;
  onChange: (owner: string | null) => void;
  onBlur?: () => void;
  filter: string[];
  label: string;
}

export const CatalogSearch = ({
  value,
  onChange,
  filter,
  onBlur,
  label,
}: OwnerSearchProps) => {
  const [owners, setOwners] = useState<UserEntity[]>([]);
  const [searchQuery, setSearchQuery] = useState(value || '');

  const catalogApi = useApi(catalogApiRef);

  useEffect(() => {
    const fetchUsers = async () => {
      const results = await catalogApi.getEntities({
        filter: {
          kind: filter,
        },
      });
      setOwners(results.items as UserEntity[]);
    };
    fetchUsers();
  }, [catalogApi, filter]);

  const filteredUsers = owners.filter(owner => {
    const email = owner?.spec.profile?.email?.toLowerCase() || '';
    const displayName = owner.spec?.profile?.displayName?.toLowerCase() || '';
    return (
      email.includes(searchQuery.toLowerCase()) ||
      displayName.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <p>{label}</p>
      <div onBlur={onBlur}>
        <SearchField
          placeholder="Search..."
          onChange={input => setSearchQuery(input)}
          value={searchQuery}
          onBlur={onBlur}
        />
      </div>
      {searchQuery && searchQuery !== value ? (
        <Paper style={{ maxHeight: 300, overflow: 'auto', margin: '2px' }}>
          <List>
            {filteredUsers.map((owner, idx) => (
              <ListItemButton
                key={idx}
                onClick={() => {
                  onChange(owner.metadata.name);
                  setSearchQuery(owner.metadata.name);
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={owner?.spec.profile?.picture!}
                    name={owner?.spec?.profile?.displayName!}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={owner?.spec?.profile?.displayName}
                  secondary={owner?.spec.profile?.email}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CatalogSearch;
