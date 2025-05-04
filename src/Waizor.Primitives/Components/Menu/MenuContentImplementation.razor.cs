using Microsoft.AspNetCore.Components;
using Waizor.Primitives.Enums;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuContentImplementation : ComponentBase, IPopperContent
{
    [Parameter, EditorRequired]
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

    [CascadingParameter]
    public required Menu Menu { get; set; }

    protected ElementReference? ElementReference;

    protected async Task OnDeactivateAsync() => await Menu.HideAsync();

    protected void OnElementReferenceChanged(ElementReference reference) =>
        ElementReference = reference;
}
