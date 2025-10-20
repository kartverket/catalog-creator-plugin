import { Flex } from '@backstage/ui';
import { Tooltip } from '@material-ui/core';
import InfoOutlinedIcon from '@mui/icons-material/infoOutlined';

type FieldHeaderProps = {
  fieldName: string;
  tooltipText?: string;
  required?: boolean;
};

export const FieldHeader = ({
  fieldName,
  tooltipText,
  required,
}: FieldHeaderProps) => {
  return (
    <Flex justify="between" align="center">
      <p
        style={{
          fontSize: '0.75rem',
        }}
      >
        {fieldName}

        {required && (
          <span style={{ color: '#ff0000', fontSize: '1rem' }}>*</span>
        )}
      </p>
      {tooltipText && (
        <Tooltip title={tooltipText} placement="top">
          <div
            style={{
              cursor: 'help',
              color: '#cbcbcbff',
            }}
          >
            <InfoOutlinedIcon sx={{ scale: '90%' }} />
          </div>
        </Tooltip>
      )}
    </Flex>
  );
};
