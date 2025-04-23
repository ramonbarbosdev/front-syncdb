import Swal from 'sweetalert2';

export function exibirErro(textoPadrao: string, erro: any): void
{
  console.log(erro);
  let titulo = 'Erro ';
  let texto = textoPadrao;

  if (erro != null) {
    titulo = erro.error?.mensagem || `Erro ${erro.status}` || 'Erro na operação';
    texto = erro.error?.detalhes || erro.error?.erro || textoPadrao;
  }
  else
  {
    titulo = titulo + erro.code;
    texto = texto + erro.error;
  }

  Swal.fire({
    icon: 'error',
    title: titulo,
    text: texto,
    confirmButtonText: 'OK',
  });
}
