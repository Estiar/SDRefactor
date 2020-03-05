import { SmartListTestPage } from './app.po';

describe('Smart List App', () => {
  let page: SmartListTestPage;

  beforeEach(() => {
    page = new SmartListTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
