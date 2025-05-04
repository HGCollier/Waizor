using Waizor.Primitives.Components.Internal;

namespace Waizor.Primitives.Components;

public partial class AlertDialogContent : DialogContentImplementation
{
    protected override void OnInitialized() => AdditionalAttributes.Add("role", "alertdialog");
}
