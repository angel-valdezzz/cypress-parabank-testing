const fields={"customer.firstName": "Automation", "customer.lastName": "Example", "customer.address.street": "123 Fictional Street", "customer.address.city": "Demo City", "customer.address.state": "CA", "customer.address.zipCode": "90210", "customer.phoneNumber": "5551234567", "customer.ssn": "123456789"};
const password='DemoPass42!';
let username;
function form(mismatch=false) {
  cy.visit(Cypress.config('baseUrl').replace(/\/$/,'')+'/register.htm');
  for (const [id,value] of Object.entries(fields)) cy.get('[id="'+id+'"]').type(value);
  cy.get('[id="customer.username"]').type(username);
  cy.get('[id="customer.password"]').type(password,{log:false});
  cy.get('#repeatedPassword').type(mismatch?'Different42!':password,{log:false});
}
function submit() { cy.get('#customerForm input[type=submit]').click(); }
function register() { form(); submit(); cy.get('#rightPanel h1').should('have.text','Welcome '+username); }
function login() { cy.get('input[name=username]').type(username); cy.get('input[name=password]').type(password,{log:false}); cy.get('#loginPanel input[type=submit]').click(); }
describe('ParaBank customer journeys',()=> {
  beforeEach(()=> { username='qa'+Date.now()+Cypress._.random(100000000); cy.clearCookies(); });
  it('register a new customer',()=> { register(); });
  it('logout and login',()=> { register(); cy.contains('a','Log Out').click(); login(); cy.get('#rightPanel h1').should('have.text','Accounts Overview'); });
  it('required registration fields',()=> { cy.visit(Cypress.config('baseUrl').replace(/\/$/,'')+'/register.htm'); submit(); cy.get('[id="customer.firstName.errors"]').should('have.text','First name is required.'); });
  it('password mismatch',()=> { form(true); submit(); cy.get('[id="repeatedPassword.errors"]').should('have.text','Passwords did not match.'); });
  it('unknown credentials',()=> { cy.visit(Cypress.config('baseUrl').replace(/\/$/,'')+'/index.htm'); login(); cy.get('#rightPanel .error').should('have.text','The username and password could not be verified.'); });
  it('open a savings account',()=> {
    register(); cy.contains('a','Open New Account').click(); cy.get('#fromAccountId option').should('have.length.at.least',1);
    cy.get('#type').select('1'); cy.get('#openAccountForm input.button').click();
    cy.get('#newAccountId').invoke('text').should('match',/^\d+$/);
    cy.get('#newAccountId').invoke('text').then(id=> { cy.get('#newAccountId').click(); cy.get('#accountId').should('have.text',id); cy.get('#accountType').should('have.text','SAVINGS'); });
  });
});
