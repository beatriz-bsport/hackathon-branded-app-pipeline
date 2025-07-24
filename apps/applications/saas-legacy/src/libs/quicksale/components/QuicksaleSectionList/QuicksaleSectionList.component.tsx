import React, { useCallback, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import useStyle from '#src/libs/quicksale/components/QuicksaleConfigurationSectionList/styles';
import QuicksaleSectionCard from '#src/libs/quicksale/components/QuicksaleSectionCard';
import QuicksaleSectionCardSkeleton from '#src/libs/quicksale/components/QuicksaleConfigurationSectionList/QuicksaleSectionCardSkeleton';
import type { QuicksaleSection } from '#src/libs/quicksale/types';

type Props = {
  loading?: boolean;
  onSectionClick: (sectionId: string) => void;
  sectionList?: Array<QuicksaleSection>;
};

const QuicksaleSectionList: React.FC<Props> = ({
  sectionList,
  loading,
  onSectionClick,
}) => {
  const [editedSectionId, setEditedSectionId] = useState('');
  const iconSelectorRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const getRefMap = useCallback(
    (): Map<string, HTMLButtonElement> => iconSelectorRef.current,
    [],
  );

  const classes = useStyle({ isQuicksaleInterfaceView: true });
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  return (
    <div
      className={classes.sectionListContainer}
      data-testid="quicksale-section-list"
    >
      <AutoSizer>
        {(autoSizerProps: { height: number; width: number }) => (
          <Grid
            container
            className={classes.sectionContainer}
            spacing={isMobile ? 2 : 3}
            style={{
              maxHeight: autoSizerProps.height,
              width: autoSizerProps.width,
            }}
          >
            {loading
              ? [...Array(12).keys()].map((index) => (
                  <Grid key={index} item lg={4} sm={6} xs={12}>
                    <QuicksaleSectionCardSkeleton />
                  </Grid>
                ))
              : (sectionList ?? []).map((section) => (
                  <Grid
                    key={section.section_id}
                    item
                    className={classes.sectionItem}
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <QuicksaleSectionCard
                      getMapRefInAdminView={getRefMap}
                      isIconBeingEdited={editedSectionId === section.section_id}
                      openIconSelector={setEditedSectionId}
                      openSection={onSectionClick}
                      section={section}
                    />
                  </Grid>
                ))}
          </Grid>
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(QuicksaleSectionList);
