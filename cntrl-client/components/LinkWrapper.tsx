import React, { ReactElement } from 'react';

interface Props {
  url?: string;
  children: ReactElement;
}

export const LinkWrapper: React.FC<Props> = ({ url, children }) => (
    url ? <a href={url} target="_blank" rel="noreferrer">{children}</a> : <>{children}</>);
