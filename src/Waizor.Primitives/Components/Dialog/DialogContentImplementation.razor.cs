using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class DialogContentImplementation : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public bool ClickOutsideDeactivates { get; set; } = true;

    [CascadingParameter]
    public required IDialog Dialog { get; set; }

    protected Dictionary<string, object>? AdditionalAttributes { get; set; }

    protected ElementReference ElementReference { get; set; }

    protected void OnDeactivate() => Dialog.Hide();
}
