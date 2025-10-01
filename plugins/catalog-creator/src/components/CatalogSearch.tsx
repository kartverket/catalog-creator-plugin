import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useEffect, useState } from 'react';

import { Entity } from '@backstage/catalog-model';
import { SearchField, Text } from '@backstage/ui';
import { List, ListItemText, Paper } from '@material-ui/core';
import ListItemButton from '@mui/material/ListItemButton';

interface CatalogSearchProps {
  value?: string;
  onChange: (owner: string | null) => void;
  onBlur?: () => void;
  filter: string;
  label: string;
}

export const CatalogSearch = ({
  value,
  onChange,
  filter,
  onBlur,
  label,
}: CatalogSearchProps) => {
  const [entity, setEntity] = useState<Entity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const catalogApi = useApi(catalogApiRef);

  useEffect(() => {
    const fetchUsers = async () => {
      const results = await catalogApi.getEntities({
        filter: {
          kind: filter,
        },
      });

      setEntity(results.items as Entity[]);
    };
    fetchUsers();
  }, [catalogApi, filter]);

  const filteredUsers = entity.filter(owner => {
    const displayName = owner.metadata.name || '';
    return displayName.includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      <p>{label}</p>
      <div>
        <SearchField
          placeholder="Search..."
          value={searchQuery}
          onChange={input => {
            setSearchQuery(input);
            setShowDropdown(true);
          }}
          onBlur={onBlur}
          onSelect={() => setShowDropdown(true)}
        />
      </div>
      {showDropdown && searchQuery && filteredUsers.length > 0 ? (
        <Paper style={{ maxHeight: 300, overflow: 'auto', margin: '2px' }}>
          <List>
            {filteredUsers.map((owner, idx) => (
              <ListItemButton
                key={idx}
                onClick={() => {
                  setSearchQuery('');
                  setShowDropdown(false);
                  onChange(owner.metadata.name);
                }}
              >
                <ListItemText primary={owner.metadata.name} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      ) : (
        <></>
      )}

      <Text>
        Selected: <b>{value || 'none'}</b>
      </Text>
    </div>
  );
};

export default CatalogSearch;
