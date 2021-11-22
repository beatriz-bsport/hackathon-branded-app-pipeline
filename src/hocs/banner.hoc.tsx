import React, { useEffect, useContext, useState, Component } from 'react';
import { Member } from '../libs/member/types';
import MemberArchiveBanner from '../libs/member/components/MemberArchiveBanner.component';

export const BannerContext = React.createContext<BannerContextValue>({
  displayBanner: true,
  banner: null,
  onChangeBanner: () => {},
  onChangeDisplayBanner: () => {},
});

export type BannerContextValue = {
  displayBanner: boolean;
  banner: React.ReactChildren;
  onChangeBanner: (banner: React.ReactChildren) => void;
  onChangeDisplayBanner: (displayBanner: boolean) => void;
};

export const BannerProvider = (props: { children: React.ReactNode }) => {
  const [banner, setBanner] = useState(null);
  const [displayBanner, setDisplayBanner] = useState(false);

  return (
    <BannerContext.Provider
      value={{
        banner,
        displayBanner,
        onChangeBanner: (_banner) => {
          setBanner(_banner);
        },
        onChangeDisplayBanner: (_displayBanner) => {
          setDisplayBanner(_displayBanner);
        },
      }}
    >
      {props.children}
    </BannerContext.Provider>
  );
};

export const useShowBanner = (banner: React.ReactChildren) => {
  const { onChangeBanner, onChangeDisplayBanner } = useContext(BannerContext);

  useEffect(() => {
    onChangeDisplayBanner(true);
    onChangeBanner(banner);

    return () => {
      onChangeDisplayBanner(false);
      onChangeBanner(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

const BannerHOC = (props: {
  banner: React.ReactChildren;
  children: React.ReactNode;
}) => {
  useShowBanner(props.banner);

  return <>{props.children}</>;
};

export const withBannerHOC =
  (banner: React.ReactChildren) => (WrappedComponent: React.ComponentType) =>
    class extends React.Component {
      render() {
        return (
          <BannerHOC banner={banner}>
            <WrappedComponent {...this.props} />
          </BannerHOC>
        );
      }
    };
export const useShowMemberBanner = (member: Member) => {
  const { onChangeBanner, onChangeDisplayBanner } = useContext(BannerContext);
  useEffect(() => {
    if (member?.archived) {
      onChangeDisplayBanner(true);
      onChangeBanner(<MemberArchiveBanner member={member} />);
    }
    return () => {
      onChangeDisplayBanner(false);
      onChangeBanner(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member]);
};
const MemberBannerHOC = (props: { member: any; children: React.ReactNode }) => {
  useShowMemberBanner(props.member);

  return <>{props.children}</>;
};

export function withMemberBannerHOC<P>(
  mapPropsToMemberBanner: (props: any) => Member,
): (component: React.ComponentType<P>) => React.ReactNode {
  return (WrappedComponent: React.ComponentType<P>) => {
    class Wrapper extends Component<P> {
      render() {
        const member = mapPropsToMemberBanner(this.props);
        return (
          <div>
            <MemberBannerHOC member={member}>
              <WrappedComponent {...this.props} />
            </MemberBannerHOC>
          </div>
        );
      }
    }
    return Wrapper;
  };
}
