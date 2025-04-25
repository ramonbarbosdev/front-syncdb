import Swal from 'sweetalert2';

export function exibirErro(textoPadrao: string, e: any): void
{
  console.log(e, textoPadrao);
  let titulo = 'Erro ';
  let texto = textoPadrao;

  if(e)
  {
      titulo = titulo + e.error.code;
      texto = texto + e.error.error;
  }
  else
  {
      titulo = titulo + 'desconhecido';
      texto = textoPadrao;
  }


  Swal.fire({
    icon: 'error',
    title: titulo,
    text: texto,
    confirmButtonText: 'OK',
  });
}
