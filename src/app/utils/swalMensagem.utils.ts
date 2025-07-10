import Swal from 'sweetalert2';

export function exibirErro(textoPadrao: string, e: any): void
{
  console.log(e, textoPadrao);
  let titulo = '';
  let texto = '';

  texto = textoPadrao;

   if (e != null)
   {
      if (e.error)
      {
        titulo = e.error.code ? e.error.code : '';
        texto = e.error.error;
        if (e.error.detalhes) {
          titulo = textoPadrao;
          texto = e.error.detalhes;
        }
      }
   }

  // Swal.fire({
  //   icon: 'error',
  //   title: titulo,
  //   text: texto,
  //   confirmButtonText: 'OK',
  // });

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: 'error',
    title: texto == '' ? titulo : texto,
  });
}
