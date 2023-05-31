import { FC, useCallback } from 'react';
import { useCntrlContext } from '@cntrl-site/sdk-nextjs';

type CntrlLayoutStyles = (selector: string, styles: Record<string, string>) => string;
type CntrlUnit = (value: number) => string;

type UseLayoutStyles = () => {
  cntrlLayoutStyles: any;
  cntrlUnit: any;
};

const useLayoutStyles: UseLayoutStyles = () => {
  const { layouts } = useCntrlContext();
  const cntrlLayoutStyles: CntrlLayoutStyles = useCallback((selector, styles) => {

  }, [layouts]);
  const cntrlUnit: CntrlUnit = useCallback((value: number) => {
    return ;
  }, [layouts]);
  return { cntrlLayoutStyles, cntrlUnit };
};


{
  'Mobile': `
          border: 1vw solid black;
        `
}

`
@media (min-width: 0px) and (max-width: 1024px) {
  .selector {
    
  }
} 

`

export const MyComponent: FC = () => {
  const { cntrlLayoutStyles, cntrlUnit } = useLayoutStyles();
  return (
    <div>
      <div className="my-class">hello</div>
      <style>{cntrlLayoutStyles('.my-class', {
        'Mobile': (cntrlUnit) => `
          border: ${cntrlUnit(10)} solid black;
          margin-bottom: ${cntrlUnit(20)}px;
        `
      })}</style>

      <style>{cntrlLayoutStyles('.my-class', {
        border: {
          'Mobile': (cntrlUnit) => `${cntrlUnit(1)} solid #000`,
          'Tablet': (cntrlUnit) => `${cntrlUnit(1)} solid #000`,
          'Desktop': (cntrlUnit) => `${cntrlUnit(1)} solid #000`
        },
        filter: 'blur(30deg)',
        opacity: 0,
      })}</style>
    </div>
  );
};
