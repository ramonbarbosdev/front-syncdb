import Swal from 'sweetalert2';

export function exibirErro(textoPadrao: string, erro: any): void {
  let titulo = 'Erro';
  let texto = textoPadrao;

  if (erro != null) {
    titulo = erro.error?.mensagem || `Erro ${erro.status}` || 'Erro na operação';
    texto = erro.error?.detalhes || erro.error?.erro || textoPadrao;
  }

  Swal.fire({
    icon: 'error',
    title: titulo,
    text: texto,
    confirmButtonText: 'OK'
  });
}
