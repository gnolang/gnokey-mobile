import { useAppDispatch } from '@/redux';
import { setLinkingData } from '@/redux/features/linkingSlice';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';


const LinkingProvider = ({ children }: { children: React.ReactNode }) => {
  const url = Linking.useURL();

  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      if (url) {
        const linkingParsedURL = Linking.parse(url);

        console.log("link url", url);
        console.log("link hostname", linkingParsedURL.hostname);
        console.log("link path", linkingParsedURL.path);
        console.log("link queryParams", linkingParsedURL.queryParams);

        dispatch(setLinkingData(linkingParsedURL))
      }
    })()
  }, [url]);

  return <>{children}</>;
};

export { LinkingProvider };