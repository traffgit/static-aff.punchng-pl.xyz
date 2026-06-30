( function( blocks, element, blockEditor ) {
    var el = element.createElement;
    var InnerBlocks = blockEditor.InnerBlocks;
    var useBlockProps = blockEditor.useBlockProps;



    blocks.registerBlockType( 'my-theme/block-wrapper', {
        title: 'Block with white Background',
        icon: 'feedback',
        category: 'layout',
        edit: function() {
            var blockProps = useBlockProps({
                style: {
                    backgroundColor: '#eeeeee',
                    padding: '20px',
                    border: '1px dashed #999',
                    minHeight: '60px'
                }
            });

            return el( 'div', blockProps, el( InnerBlocks ) );
        },
        save: function() {
            return el( InnerBlocks.Content );
        },
    } );
}( window.wp.blocks, window.wp.element, window.wp.blockEditor ) );