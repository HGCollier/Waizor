using Microsoft.AspNetCore.Components;
using Waizor.Enums;

namespace Waizor.Components;

public partial class PopoverContent : ComponentBase, IPopperContent
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public Side Side { get; set; } = Side.Bottom;

    [Parameter]
    public int SideOffset { get; set; }

    [Parameter]
    public Align Align { get; set; } = Align.Center;

    [Parameter]
    public int AlignOffset { get; set; }

    [Parameter]
    public int ArrowPadding { get; set; }

    [Parameter]
    public string? Id { get; set; }

    [CascadingParameter]
    public required Popover Popover { get; set; }

    private ElementReference? elementReference;

    private void OnElementReferenceChanged(ElementReference reference) =>
        elementReference = reference;

    private void OnDeactivate() => Popover.Hide();

    protected override void OnParametersSet() =>
        Popover.ContentId = Id ?? Guid.NewGuid().ToString();
}
