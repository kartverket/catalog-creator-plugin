import { FocusEventHandler, useState } from 'react';

import { Entity } from '@backstage/catalog-model';
import { SearchField } from '@backstage/ui';
import { List, ListItemText, Paper } from '@material-ui/core';
import ListItemButton from '@mui/material/ListItemButton';

interface CatalogSearchProps {
  value: string | undefined;
  entityList: Entity[];
  onChange: (entity: string | null) => void;
  onBlur: () => void;

  label: string;
  isRequired: boolean;
}

export const CatalogSearch = ({
  onChange,
  entityList,
  value,
  onBlur,
  label,
  isRequired,
}: CatalogSearchProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredEntities = entityList.filter(entity => {
    const displayName = entity.metadata.name || '';
    if (value) {
      return displayName.includes(value.toLowerCase());
    }
    return displayName;
  });

  const handleOnBlur: FocusEventHandler<HTMLDivElement> = () => {
    const entityNames = entityList.map(entity => entity.metadata.name);
    setShowDropdown(false);
    if (value && entityNames.includes(value)) {
      onChange(value || '');
    } else {
      onChange('');
    }
    onBlur();
  };

  const handleFocus = () => {
    setShowDropdown(true);
    onChange('');
  };

  return (
    <div
      onFocus={handleFocus}
      onBlur={handleOnBlur}
      style={{ position: 'relative', overflow: 'visible' }}
    >
      <div style={{ position: 'relative', overflow: 'visible' }}>
        <SearchField
          placeholder="Search..."
          value={value}
          label={label}
          isRequired={isRequired}
          onChange={input => {
            onChange(input);
          }}
        />

        {showDropdown && filteredEntities.length > 0 ? (
          <Paper
            style={{
              maxHeight: 300,
              overflowY: 'auto',
              margin: '2px',
              position: 'absolute',
              zIndex: 1,
              width: '100%',
            }}
          >
            <List>
              {filteredEntities.map(entity => (
                <ListItemButton
                  key={entity.metadata.name}
                  onMouseDown={e => e.preventDefault()}
                  onClick={e => {
                    e.stopPropagation();
                    onChange(entity.metadata.name);
                    setShowDropdown(false);
                    onBlur();
                  }}
                >
                  <ListItemText primary={entity.metadata.name} />
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
