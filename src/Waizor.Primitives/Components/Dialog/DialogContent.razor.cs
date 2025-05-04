using Waizor.Primitives.Components.Internal;

namespace Waizor.Primitives.Components;

public partial class DialogContent : DialogContentImplementation
{
    protected override void OnInitialized() => AdditionalAttributes.Add("role", "dialog");
}
