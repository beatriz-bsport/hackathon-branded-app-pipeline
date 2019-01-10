import FactoryBot from 'ya-factorybot';

FactoryBot.define('ReportConfiguration', {
  id: FactoryBot.sequence(),
  name: (o) => `Configuration du rapport #${o.id}`,
  description: 'Description pour le rapport de configuration',
  category: () =>
    ['members', 'payments', 'products'][Math.floor(Math.random() * 3)],
  columns: () => ['first_name', 'last_name'],
});
