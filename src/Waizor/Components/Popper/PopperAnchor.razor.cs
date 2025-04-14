using Microsoft.AspNetCore.Components;
using Waizor.Abstractions;
using Waizor.Exceptions;

namespace Waizor.Components;

public partial class PopperAnchor : SlotBase
{
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [CascadingParameter]
    public required Popper Popper { get; set; }

    [Parameter]
    public Func<ElementReference>? For { get; set; }

    protected override Dictionary<string, object>? Attributes => AdditionalAttributes;

    private ElementReference? elementReference;

    protected override void OnAfterRender(bool firstRender)
    {
        if (!firstRender)
        {
            return;
        }

        if (AsChild)
        {
            Popper.SetAnchor(
                (For ?? throw new ElementReferenceNotProvidedException(GetType().Name))()
            );
            return;
        }

        if (!elementReference.HasValue)
        {
            return;
        }

        Popper.SetAnchor(elementReference.Value);
    }
}
