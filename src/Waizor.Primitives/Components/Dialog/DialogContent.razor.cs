using Waizor.Primitives.Components.Internal;

namespace Waizor.Primitives.Components;

public partial class DialogContent : DialogContentImplementation
{
    public DialogContent() => AdditionalAttributes = new Dictionary<string, object>() { { "role", "dialog" } };
}
