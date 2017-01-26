import { RideTheLightningPage } from './app.po';

describe('ride-the-lightning App', function() {
  let page: RideTheLightningPage;

  beforeEach(() => {
    page = new RideTheLightningPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
