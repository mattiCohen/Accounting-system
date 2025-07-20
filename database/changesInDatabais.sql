

use software;

ALTER TABLE customers
ADD COLUMN CustomerCardNumber int;

ALTER TABLE Providers
CHANGE COLUMN ProviderCompanyNumber ProviderCardNumber int;

describe Providers;
describe Customers;


