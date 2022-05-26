import Document, { DocumentContext } from 'next/document';
import { createGenerateId, JssProvider, SheetsRegistry } from 'react-jss';
import { Enhancer } from 'next/dist/shared/lib/utils';

export default // @ts-ignore
class JssDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const registry = new SheetsRegistry();
    const generateId = createGenerateId();
    // eslint-disable-next-line react/display-name
    const enhanceApp: Enhancer<any> = (App) => (props: any) => (
      <JssProvider registry={registry} generateId={generateId}>
        <App {...props} />
      </JssProvider>
    );
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () => originalRenderPage({ enhanceApp });
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style id="server-side-styles">{registry.toString()}</style>
        </>
      )
    };
  }
}
