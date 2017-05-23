import { A2DopeWarsPage } from './app.po';

describe('a2-dope-wars App', () => {
  let page: A2DopeWarsPage;

  beforeEach(() => {
    page = new A2DopeWarsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
