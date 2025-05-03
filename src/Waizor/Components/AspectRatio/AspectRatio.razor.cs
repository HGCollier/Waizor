using Microsoft.AspNetCore.Components;

namespace Waizor.Components
{
    public sealed partial class AspectRatio : ComponentBase
    {
        [Parameter, EditorRequired]
        public required RenderFragment ChildContent { get; set; }

        [Parameter, EditorRequired]
        public double Ratio { get; set; }
    }
}
