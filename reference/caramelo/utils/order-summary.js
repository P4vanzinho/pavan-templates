export function formatOrderSummary(items, customer) {
  const date = new Date(customer.date + "T12:00:00").toLocaleDateString(
    "pt-BR",
  );
  const lines = items.map((item) => `${item.quantity} × ${item.product.name}`);
  return [
    "Pedido demonstrativo · CaraMelo",
    "",
    ...lines,
    "",
    `Nome: ${customer.name}`,
    `E-mail: ${customer.email}`,
    `Telefone: ${customer.phone}`,
    `Data desejada: ${date}`,
    `Ocasião: ${customer.occasion}`,
    ...(customer.occasionNote
      ? [`Sugestão para a ocasião: ${customer.occasionNote}`]
      : []),
    `Pessoas: ${customer.guests}`,
    `Recebimento: ${customer.fulfillment}`,
    ...(customer.fulfillment === "Entrega"
      ? [`Endereço: ${customer.address}`]
      : []),
    ...(customer.idea ? [`Observações: ${customer.idea}`] : []),
    "",
    "Simulação: nenhum pedido ou e-mail foi enviado. Valores e disponibilidade a confirmar.",
  ].join("\n");
}
