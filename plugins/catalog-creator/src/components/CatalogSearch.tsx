import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { FocusEventHandler, useEffect, useState } from 'react';

import { Entity } from '@backstage/catalog-model';
import { SearchField } from '@backstage/ui';
import { List, ListItemText, Paper } from '@material-ui/core';
import ListItemButton from '@mui/material/ListItemButton';

interface CatalogSearchProps {
  
  onChange: (owner: string | null) => void;
  onBlur: () => void;
  filter: string;
  label: string;
  isRequired: boolean;
}

export const CatalogSearch = ({
  onChange,
  filter,
  onBlur,
  label,
  isRequired,
}: CatalogSearchProps) => {
  const [entity, setEntity] = useState<Entity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<boolean>(false);

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

  const handleOnBlur: FocusEventHandler<HTMLDivElement> = () => {
    if (!selected) {
      setSearchQuery('');
      setShowDropdown(false);
      onBlur();
    }
  };

  const handleSelect = () => {
    setShowDropdown(true);
    setSelected(false);
    onChange('');
  };

  return (
    <div
      onBlur={handleOnBlur}
      style={{ position: 'relative', overflow: 'visible' }}
    >
      <div style={{ position: 'relative', overflow: 'visible' }}>
        <SearchField
          placeholder="Search..."
          value={searchQuery}
          label={label}
          isRequired={isRequired}
          onChange={input => {
            setSearchQuery(input);
            setShowDropdown(true);
          }}
          onSelect={handleSelect}
        />

        {showDropdown && filteredUsers.length > 0 ? (
          <Paper
            style={{
              maxHeight: 300,
              overflowY: 'auto',
              margin: '2px',
              position: 'absolute',
              zIndex: '1',
              width: '100%',
            }}
          >
            <List>
              {filteredUsers.map((owner, idx) => (
                <ListItemButton
                  key={idx}
                  onMouseDown={e => e.preventDefault()}
                  onClick={e => {
                    e.stopPropagation();
                    setSearchQuery(owner.metadata.name);
                    setSelected(true);
                    setShowDropdown(false);
                    onChange(owner.metadata.name);
                    onBlur();
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
      </div>
    </div>
  );
};

export default CatalogSearch;
