using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class Checkbox<T> : ComponentBase
{
    [Parameter]
    public required RenderFragment<CheckboxState> ChildContent { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Name { get; set; }

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public bool? DefaultChecked { get; set; } = false;

    [Parameter]
    public bool? Checked { get; set; } = null;

    [Parameter]
    public bool Parent { get; set; }

    [Parameter]
    public EventCallback<bool?> CheckedChanged { get; set; }

    [Parameter]
    public T? Value { get; set; }

    [Parameter]
    public bool Disabled { get; set; }

    [Parameter]
    public bool ReadOnly { get; set; }

    [Parameter]
    public bool Required { get; set; }

    private CheckboxState State => GetState();

    private async Task OnClickAsync()
    {
        if (ReadOnly)
        {
            return;
        }

        Checked ??= false;
        Checked = !Checked;

        await CheckedChanged.InvokeAsync(Checked);
    }

    private CheckboxState GetState()
    {
        if (!Checked.HasValue)
        {
            return CheckboxState.Indeterminate;
        }

        if (Checked.Value)
        {
            return CheckboxState.Checked;
        }

        return CheckboxState.Unchecked;
    }

    protected override void OnInitialized()
    {
        if (!DefaultChecked.HasValue || Checked.HasValue)
        {
            return;
        }

        Checked = DefaultChecked;
    }
}
