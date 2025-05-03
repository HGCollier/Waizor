using Waizor.Primitives.Components.Internal;

namespace Waizor.Primitives.Components;

public partial class AlertDialogContent : DialogContentImplementation
{
    public AlertDialogContent() =>
        AdditionalAttributes = new Dictionary<string, object>() { { "role", "alertdialog" } };
}
